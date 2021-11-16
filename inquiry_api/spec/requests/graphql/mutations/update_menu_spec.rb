# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateMenu, type: :request do
  let(:menu) { create :menu }
  let(:menu_attributes) { menu.attributes.symbolize_keys }
  def input(menu)
    <<~INPUT
      mutation {
        updateMenu(input: {
          #{menu[:id].present? ? "id: #{menu[:id]}," : nil}
          name: "#{menu[:name]}"
        }) {
          id
          name
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが更新される' do
      new_name = 'asserted_text'
      result = AppSchema.execute input(menu_attributes.merge({ name: new_name }))
      is_asserted_by { result.dig('data', 'updateMenu', 'name') == new_name }
      is_asserted_by { menu.reload.name == new_name }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      before_name = menu.name
      result = AppSchema.execute input(menu_attributes.merge({ name: nil }))
      is_asserted_by { result.key?('errors') }
      is_asserted_by { menu.reload.name == before_name }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(menu_attributes.merge({ id: 0 }))
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Menu.find(menu.id).present? }
    end
  end
end
