# == Schema Information
#
# Table name: addresses
#
#  id          :bigint           not null, primary key
#  building    :string
#  city        :string           not null
#  postal_code :string           not null
#  prefecture  :string           not null
#  street      :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_addresses_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Address, type: :model do
  describe '# validations' do
    let(:address) { build(:address) }

    context 'postal_code が有効な値でない場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '郵便番号は不正な値です'

        address.postal_code = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }

        address.postal_code = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }

        address.postal_code = '1234567'
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }
      end
    end

    context 'prefecture が有効な値でない場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '都道府県は一覧にありません'

        address.prefecture = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }

        address.prefecture = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }

        address.prefecture = 'じゃん県'
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }
      end
    end

    context 'city が空の場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '市区町村を入力してください'

        address.city = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }

        address.city = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }
      end
    end

    context 'street が空の場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '町名・番地を入力してください'

        address.street = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }

        address.street = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.first == expected_error }
      end
    end
  end

  describe '# full_address / full_address_with_postal_code' do
    let(:address) { create(:address) }

    context 'full_address' do
      it '都道府県〜建物名までが連結された値を返す' do
        address
        expected = %i[prefecture city street building].map { |k| address.send k }.join
        is_asserted_by { address.full_address == expected }
      end
    end

    context 'full_address_with_postal_code' do
      it '郵便番号 + 都道府県〜建物名までが連結された値を返す' do
        address
        expected = [address.postal_code, %i[prefecture city street building].map { |k| address.send k }.join].join(' ')
        is_asserted_by { address.full_address_with_postal_code == expected }
      end
    end
  end
end