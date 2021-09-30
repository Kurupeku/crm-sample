# == Schema Information
#
# Table name: menus
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  published_on :date
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require 'rails_helper'

RSpec.describe Menu, type: :model do
  describe '# validateions' do
    let(:menu) { build :menu }

    context 'nameが空の場合' do
      it 'バリデーションに弾かれる' do
        expected_error = 'メニュー名を入力してください'

        menu.name = ''
        menu.valid?
        is_asserted_by { menu.errors.full_messages.first == expected_error }

        menu.name = nil
        menu.valid?
        is_asserted_by { menu.errors.full_messages.first == expected_error }
      end
    end

    context 'nameがDB上に存在する場合' do
      it 'バリデーションに弾かれる' do
        expected_error = 'メニュー名はすでに存在します'
        exist_menu = create :menu

        menu.name = exist_menu.name
        menu.valid?
        is_asserted_by { menu.errors.full_messages.first == expected_error }
      end
    end
  end
end
