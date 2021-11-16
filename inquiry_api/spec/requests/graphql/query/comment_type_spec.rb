# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::CommentType, type: :request do
  before do
    @model_key = :comment
    @models_key = @model_key.to_s.downcase.pluralize.camelize(:lower).to_sym
    @models_list_key = "#{@models_key}List".to_sym
  end

  describe '単数取得' do
    let(:record) { create @model_key }
    let(:query) do
      <<~QUERY
        query {
          #{@model_key}(id: #{record.id}) {
            id
          }
        }
      QUERY
    end

    it '指定したレコードが取得できること' do
      result = AppSchema.execute query
      res = result.dig 'data', @model_key.to_s

      expect(res).to include(
        'id' => record.id.to_s
      )
    end
  end

  describe '一覧取得' do
    let(:inquiry_ids) { create_list(:inquiry, 5).map(&:id) }
    let(:records) do
      5.times.map do
        create @model_key, inquiry_id: inquiry_ids.sample
      end
    end
    let(:record_ids) { records.map(&:id).reverse }
    def query(inquiry_id: nil, order: nil)
      <<~QUERY
        query {
          #{@models_key}(#{inquiry_id.present? ? "inquiryId: #{inquiry_id}, " : nil}order: "#{order}") {
            id
          }
        }
      QUERY
    end

    context 'variantsを指定しない場合' do
      it 'レコードの一覧が取得できること' do
        records
        result = AppSchema.execute query
        records_result = result.dig 'data', @models_key.to_s

        is_asserted_by { records_result.size == records.size }
        is_asserted_by do
          records_result.map { |u| u['id'].to_i } == record_ids
        end
      end
    end

    context 'orderが与えられた場合' do
      it '与えられた値に基づいてソートされたレコードの一覧が取得できること' do
        records
        result = AppSchema.execute query(order: 'id asc')
        records_result = result.dig 'data', @models_key.to_s

        is_asserted_by { records_result.size == records.size }
        is_asserted_by do
          records_result.map { |u| u['id'].to_i } == record_ids.reverse
        end
      end
    end

    context 'inquiry_idが与えられた場合' do
      it 'inquiry_idが与えられた値と一致するレコードの一覧が取得できること' do
        records
        target_id = inquiry_ids.sample
        result = AppSchema.execute query(inquiry_id: target_id)
        records_result = result.dig 'data', @models_key.to_s

        is_asserted_by { records_result.size == Comment.where(inquiry_id: target_id).size }
      end
    end
  end

  describe 'ページネーション' do
    let(:inquiry_ids) { create_list(:inquiry, 5).map(&:id) }
    let(:records) do
      30.times.map do
        create @model_key, inquiry_id: inquiry_ids.sample
      end
    end
    let(:record_ids) { records.map(&:id).reverse }
    def query(page: nil, per: nil, inquiry_id: nil, order: nil)
      <<~QUERY
        query {
          #{@models_list_key}(#{page.present? ? "page: #{page}, " : nil}#{per.present? ? "per: #{per}, " : nil}#{inquiry_id.present? ? "inquiryId: #{inquiry_id}, " : nil}order: "#{order}") {
            #{@models_key} {
              id
            }
            pageInfo {
              currentPage
              pagesCount
              recordsCount
              limit
            }
          }
        }
      QUERY
    end

    context 'variantsを指定しない場合' do
      it 'per: 25, page: 1の状態でレコードの一覧がページネーション付きで取得できること' do
        records
        result = AppSchema.execute query
        records_result = result.dig 'data', @models_list_key.to_s, @models_key.to_s
        page_info_result = result.dig 'data', @models_list_key.to_s, 'pageInfo'

        is_asserted_by { records_result.size == 25 }
        is_asserted_by do
          records_result.map { |u| u.fetch('id').to_i } == record_ids[0...25]
        end
        is_asserted_by { page_info_result.fetch('recordsCount') == 30 }
        is_asserted_by { page_info_result.fetch('pagesCount') == 2 }
      end
    end

    context 'per / pageが与えられた場合' do
      it 'レコードの一覧が指定されたlimit / offsetで取得できること' do
        records
        result = AppSchema.execute query(per: 20, page: 2)
        records_result = result.dig 'data', @models_list_key.to_s, @models_key.to_s
        page_info_result = result.dig 'data', @models_list_key.to_s, 'pageInfo'

        is_asserted_by { records_result.size == 10 }
        is_asserted_by do
          records_result.map { |u| u.fetch('id').to_i } == record_ids[20...30]
        end
        is_asserted_by { page_info_result.fetch('recordsCount') == 30 }
        is_asserted_by { page_info_result.fetch('pagesCount') == 2 }
      end
    end

    context 'orderが与えられた場合' do
      it '与えられた値に基づいてソートされたレコードの一覧が取得できること' do
        records
        result = AppSchema.execute query(order: 'id asc')
        records_result = result.dig 'data', @models_list_key.to_s, @models_key.to_s
        page_info_result = result.dig 'data', @models_list_key.to_s, 'pageInfo'

        is_asserted_by { records_result.size == 25 }
        is_asserted_by do
          records_result.map { |u| u.fetch('id').to_i } == record_ids.reverse[0...25]
        end
        is_asserted_by { page_info_result.fetch('recordsCount') == 30 }
        is_asserted_by { page_info_result.fetch('pagesCount') == 2 }
      end
    end

    context 'inquiry_idが与えられた場合' do
      it 'inquiry_idが与えられた値と一致するレコードの一覧が取得できること' do
        records
        target_id = inquiry_ids.sample
        result = AppSchema.execute query(inquiry_id: target_id, per: 30)
        records_result = result.dig 'data', @models_list_key.to_s, @models_key.to_s
        page_info_result = result.dig 'data', @models_list_key.to_s, 'pageInfo'

        len = Comment.where(inquiry_id: target_id).size
        is_asserted_by { records_result.size == len }
        is_asserted_by { page_info_result.fetch('recordsCount') == len }
        is_asserted_by { page_info_result.fetch('pagesCount') == 1 }
      end
    end
  end
end
