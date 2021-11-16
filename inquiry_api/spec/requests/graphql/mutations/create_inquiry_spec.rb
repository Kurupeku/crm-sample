# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::CreateInquiry, type: :request do
  let(:inquiry_attributes) { attributes_for :inquiry }
  let(:progress_attributes) { attributes_for :progress }
  def input(inquiry, progress)
    <<~INPUT
      mutation {
        createInquiry(input: {
          #{inquiry[:user_id].present? ? "userId: #{inquiry[:user_id]}," : nil}
          companyName: "#{inquiry[:company_name]}",
          name: "#{inquiry[:name]}",
          email: "#{inquiry[:email]}",
          tel: "#{inquiry[:tel]}",
          #{inquiry[:number_of_users].present? ? "numberOfUsers: #{inquiry[:number_of_users]}," : nil}
          introductoryTerm: "#{inquiry[:introductory_term]}",
          detail: "#{inquiry[:detail]}",
          #{inquiry[:menu_ids].present? ? "menuIds: #{inquiry[:menu_ids]}," : nil}
          progress: {
            #{progress[:rank].present? ? "rank: #{progress[:rank]}" : nil},
            #{progress[:staff_id].present? ? "staffId: #{progress[:staff_id]}" : nil},
          }
        }) {
          id
          name
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが作成される' do
      result = AppSchema.execute input(inquiry_attributes, progress_attributes.merge({ rank: 0 }))
      is_asserted_by { result.dig('data', 'createInquiry', 'name') == inquiry_attributes[:name] }
      is_asserted_by { Inquiry.first.name == inquiry_attributes[:name] }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは作成されない' do
      result = AppSchema.execute input(inquiry_attributes.merge({ email: nil }), progress_attributes)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Inquiry.all.size.zero? }
    end
  end
end
