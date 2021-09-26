# == Schema Information
#
# Table name: addresses
#
#  id          :bigint           not null, primary key
#  building    :string
#  city        :string
#  postal_code :string
#  prefecture  :string
#  street      :string
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
  describe '# validateions' do
    let(:address) { build(:address) }

    context 'postal_code が有効な値でない場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[郵便番号は不正な値です].sort

        address.postal_code = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }

        address.postal_code = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }

        address.postal_code = '1234567'
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }
      end
    end

    context 'prefecture が有効な値でない場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[都道府県は一覧にありません].sort

        address.prefecture = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }

        address.prefecture = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }

        address.prefecture = 'じゃん県'
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }
      end
    end

    context 'city が空の場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[市区町村を入力してください]

        address.city = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }

        address.city = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }
      end
    end

    context 'street が空の場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[町名・番地を入力してください]

        address.street = ''
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }

        address.street = nil
        address.valid?
        is_asserted_by { address.errors.full_messages.sort == expected_errors }
      end
    end
  end
end
