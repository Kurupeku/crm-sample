# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::UserType, type: :request do
  describe 'user' do
    let(:user) { create :user }
    let(:query) do
      <<~QUERY
        query {
          user(id: #{user.id}) {
            id
          }
        }
      QUERY
    end

    it '指定したUserが取得できること' do
      result = AppSchema.execute query
      res = result.dig 'data', 'user'

      expect(res).to include(
        'id' => user.id.to_s
      )
    end
  end

  describe 'users' do
    let(:users) { create_list :user, 5 }
    let(:user_ids) { users.map(&:id).sort }
    def query(fields_cont:, order:)
      <<~QUERY
        query {
          users(fieldsCont: "#{fields_cont}", order: "#{order}") {
            id
          }
        }
      QUERY
    end

    it 'Userの一覧が取得できること' do
      users
      result = AppSchema.execute query(fields_cont: nil, order: 'id asc')
      users_result = result.dig 'data', 'users'

      is_asserted_by { users_result.size == users.size }
      is_asserted_by do
        users_result.map { |u| u['id'].to_i }.sort == user_ids
      end
    end
  end

  describe 'usersList' do
    let(:users) { create_list :user, 30 }
    let(:user_ids) { users.map(&:id).sort }
    def query(page:, per:, fields_cont:, order:)
      <<~QUERY
        query {
          usersList(page: #{page}, per: #{per}, fieldsCont: "#{fields_cont}", order: "#{order}") {
            users {
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

    it 'Userの一覧がページネーション付きで取得できること' do
      users
      result = AppSchema.execute query(page: 1, per: 10, fields_cont: nil, order: 'id asc')
      users_result = result.dig 'data', 'usersList', 'users'
      page_info_result = result.dig 'data', 'usersList', 'pageInfo'

      is_asserted_by { users_result.size == 10 }
      is_asserted_by do
        users_result.map { |u| u.fetch('id').to_i }.sort == user_ids[0...10]
      end
      is_asserted_by { page_info_result.fetch('recordsCount') == 30 }
      is_asserted_by { page_info_result.fetch('pagesCount') == 3 }
    end
  end
end
