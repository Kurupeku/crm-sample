# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateInquiry, type: :request do
  let(:inquiry) { create :inquiry }
  let(:inquiry_attributes) { inquiry.attributes.symbolize_keys }
  let(:progress) { create :progress, inquiry: inquiry }
  let(:progress_attributes) { progress.attributes.symbolize_keys }
  def input(inquiry, progress)
    <<~INPUT
      mutation {
        updateInquiry(input: {
          #{inquiry[:id].present? ? "id: #{inquiry[:id]}," : nil}
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
    it 'レコードが更新される' do
      new_name = 'asserted_name'
      result = AppSchema.execute input(inquiry_attributes.merge({ name: new_name }),
                                       progress_attributes.merge({ rank: 1 }))
      is_asserted_by { result.dig('data', 'updateInquiry', 'name') == new_name }
      is_asserted_by { inquiry.reload.name == new_name }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      before_email = inquiry.email
      result = AppSchema.execute input(inquiry_attributes.merge({ email: nil }), progress_attributes)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { inquiry.reload.email == before_email }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(inquiry_attributes.merge({ id: 0 }), progress_attributes)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Inquiry.find(inquiry.id).present? }
    end
  end
end
