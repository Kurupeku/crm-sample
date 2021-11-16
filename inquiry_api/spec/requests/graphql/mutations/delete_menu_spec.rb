# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::DeleteMenu, type: :request do
  let(:menu) { create :menu }
  def input(id)
    <<~INPUT
      mutation {
        deleteMenu(input: { id: "#{id}" }) {
          id
          name
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが削除される' do
      result = AppSchema.execute input(menu.id)
      is_asserted_by { result.dig('data', 'deleteMenu', 'name') == menu.name }
      is_asserted_by { Menu.find_by_id(menu.id).nil? }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは削除されない' do
      result = AppSchema.execute input(0)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Menu.find(menu.id).present? }
    end
  end
end
