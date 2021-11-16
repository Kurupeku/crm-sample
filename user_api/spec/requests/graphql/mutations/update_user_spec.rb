# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateUser, type: :request do
  let(:user) { create :user }
  let(:user_attributes) { user.attributes.symbolize_keys }
  let(:address) { create :address, user: user }
  let(:address_attributes) { address.attributes.symbolize_keys }
  def input(user, address)
    <<~INPUT
      mutation {
        updateUser(input: {
          #{user.fetch(:id) ? "id: #{user[:id]}" : nil}
          companyName: "#{user[:company_name]}",
          name: "#{user[:name]}",
          email: "#{user[:email]}",
          tel: "#{user[:tel]}",
          address: {
            postalCode: "#{address[:postal_code]}",
            prefecture: "#{address[:prefecture]}",
            city: "#{address[:city]}",
            street: "#{address[:street]}",
            building: "#{address[:building]}",
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
      user.name = new_name
      result = AppSchema.execute input(user_attributes, address_attributes)
      is_asserted_by { result.dig('data', 'updateUser', 'name') == new_name }
      is_asserted_by { user.reload.name == new_name }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      before_email = user.email
      user.email = nil
      result = AppSchema.execute input(user_attributes, address_attributes)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { user.reload.email == before_email }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      user_attributes[:id] = 0
      result = AppSchema.execute input(user_attributes, address_attributes)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { User.find(user.id).present? }
    end
  end
end
