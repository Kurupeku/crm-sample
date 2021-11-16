# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateUser, type: :request do
  let(:user) { create :user }
  let(:user_attributes) { user.attributes.symbolize_keys }
  def input(user)
    <<~INPUT
      mutation {
        deleteUser(input: { id: "#{user[:id]}" }) {
          id
          name
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが削除される' do
      result = AppSchema.execute input(user_attributes)
      is_asserted_by { result.dig('data', 'deleteUser', 'name') == user.name }
      is_asserted_by { User.find_by_id(user.id).nil? }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは削除されない' do
      user_attributes[:id] = 0
      result = AppSchema.execute input(user_attributes)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { User.find(user.id).present? }
    end
  end
end
