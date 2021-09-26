# == Schema Information
#
# Table name: users
#
#  id           :bigint           not null, primary key
#  company_name :string
#  email        :string           not null
#  name         :string           not null
#  tel          :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require 'rails_helper'

RSpec.describe User, type: :model do
  describe '# validateions' do
    let(:user) { build(:user) }

    context 'name が blank の場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[名前を入力してください].sort

        user.name = ''
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }

        user.name = nil
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }
      end
    end

    context 'email が blank の場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[Emailを入力してください Emailは不正な値です].sort

        user.email = ''
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }

        user.email = nil
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }
      end
    end

    context 'email が正しいフォーマットではない場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[Emailは不正な値です].sort

        user.email = 'email.email.com'
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }
      end
    end

    context 'tel が blank の場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[電話番号を入力してください 電話番号は不正な値です].sort

        user.tel = ''
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }

        user.tel = nil
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }
      end
    end

    context 'tel が正しいフォーマットでない場合' do
      it 'バリデーションに引っかかる' do
        expected_errors = %w[電話番号は不正な値です].sort

        user.tel = '123456789011'
        user.valid?
        is_asserted_by { user.errors.full_messages.sort == expected_errors }
      end
    end
  end
end
