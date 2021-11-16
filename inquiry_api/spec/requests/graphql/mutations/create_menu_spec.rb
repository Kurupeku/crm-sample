# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::CreateMenu, type: :request do
  let(:menu_attributes) { attributes_for :menu }
  def input(menu)
    <<~INPUT
      mutation {
        createMenu(input: {
          name: "#{menu[:name]}"
        }) {
          id
          name
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが作成される' do
      result = AppSchema.execute input(menu_attributes)
      is_asserted_by { result.dig('data', 'createMenu', 'name') == menu_attributes[:name] }
      is_asserted_by { Menu.first.name == menu_attributes[:name] }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは作成されない' do
      result = AppSchema.execute input(menu_attributes.merge({ name: nil }))
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Menu.all.size.zero? }
    end
  end
end
