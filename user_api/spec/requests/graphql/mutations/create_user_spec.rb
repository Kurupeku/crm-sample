# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::CreateUser, type: :request do
  let(:user_attr) { attributes_for :user }
  let(:address_attr) { attributes_for :address }
  def input(user, address)
    <<~INPUT
      mutation {
        createUser(input: {
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

  describe '正常な値のとき' do
    it 'レコードが作成される' do
      result = AppSchema.execute input(user_attr, address_attr)
      is_asserted_by { result.dig('data', 'createUser', 'name') == user_attr[:name] }
      is_asserted_by { User.first.name == user_attr[:name] }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは生成されない' do
      user_attr[:email] = nil
      result = AppSchema.execute input(user_attr, address_attr)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { User.all.size.zero? }
    end
  end
end
