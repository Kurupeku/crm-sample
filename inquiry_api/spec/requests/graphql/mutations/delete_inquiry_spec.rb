# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::DeleteInquiry, type: :request do
  let(:inquiry) { create :inquiry }
  def input(id)
    <<~INPUT
      mutation {
        deleteInquiry(input: { id: "#{id}" }) {
          id
          name
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが削除される' do
      result = AppSchema.execute input(inquiry.id)
      is_asserted_by { result.dig('data', 'deleteInquiry', 'name') == inquiry.name }
      is_asserted_by { Inquiry.find_by_id(inquiry.id).nil? }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは削除されない' do
      result = AppSchema.execute input(0)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Inquiry.find(inquiry.id).present? }
    end
  end
end
