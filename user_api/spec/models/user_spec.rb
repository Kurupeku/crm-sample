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
# Indexes
#
#  index_users_on_email  (email)
#
require 'rails_helper'

RSpec.describe User, type: :model do
  describe '# validateions' do
    let(:user) { build(:user) }

    context 'name が blank の場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '名前を入力してください'

        user.name = ''
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }

        user.name = nil
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }
      end
    end

    context 'email が正しいフォーマットではない場合' do
      it 'バリデーションに引っかかる' do
        expected_error = 'Emailは不正な値です'

        user.email = ''
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }

        user.email = nil
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }

        user.email = 'email.email.com'
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }
      end
    end

    context 'email が登録済みの場合' do
      it 'バリデーションに引っかかる' do
        expected_error = 'Emailはすでに存在します'

        exist_user = create :user
        user.email = exist_user.email
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }
      end
    end

    context 'tel が正しいフォーマットでない場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '電話番号は不正な値です'

        user.tel = ''
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }

        user.tel = nil
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }

        user.tel = '123456789011'
        user.valid?
        is_asserted_by { user.errors.full_messages.first == expected_error }
      end
    end
  end
end
