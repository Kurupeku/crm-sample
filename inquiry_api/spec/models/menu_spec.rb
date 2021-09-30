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

  describe '# scope' do
    context 'published / private' do
      before do
        create_list :menu, 4
        create_list :menu, 5, published_on: Date.current
      end

      it 'published => where.not(published: nil) のデータのみが取得できる' do
        is_asserted_by { Menu.published.size == 5 }
      end

      it 'unpublished => where(published: nil) のデータのみが取得できる' do
        is_asserted_by { Menu.unpublished.size == 4 }
      end
    end
  end
end
