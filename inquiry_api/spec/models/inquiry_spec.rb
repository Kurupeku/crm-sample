# frozen_string_literal: true

# == Schema Information
#
# Table name: inquiries
#
#  id                :bigint           not null, primary key
#  company_name      :string
#  detail            :text
#  email             :string           not null
#  introductory_term :string           not null
#  name              :string           not null
#  number_of_users   :integer          not null
#  tel               :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :integer
#
require 'rails_helper'

RSpec.describe Inquiry, type: :model do
  let(:model) { Inquiry }

  describe '# validations' do
    let(:inquiry) { build :inquiry }

    context 'nameが空の場合' do
      it 'バリデーションに弾かれる' do
        expected_error = '担当者名を入力してください'

        inquiry.name = ''
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }

        inquiry.name = nil
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }
      end
    end

    context 'number_of_usersが空の場合' do
      it 'バリデーションに弾かれる' do
        expected_error = '利用人数を入力してください'

        inquiry.number_of_users = ''
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }

        inquiry.number_of_users = nil
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }
      end
    end

    context 'number_of_usersが1未満もしくはInteger以外の場合' do
      it 'バリデーションに弾かれる' do
        inquiry.number_of_users = 0
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == '利用人数は0より大きい値にしてください' }

        inquiry.number_of_users = 1.1
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == '利用人数は整数で入力してください' }
      end
    end

    context 'introductory_termが空の場合' do
      it 'バリデーションに弾かれる' do
        expected_error = '導入時期を入力してください'

        inquiry.introductory_term = ''
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }

        inquiry.introductory_term = nil
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }
      end
    end

    context 'emailが正しいフォーマットでない場合' do
      it 'バリデーションに弾かれる' do
        expected_error = 'Emailは不正な値です'

        inquiry.email = ''
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }

        inquiry.email = nil
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }

        inquiry.email = 'email.email.com'
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }
      end
    end

    context 'tel が正しいフォーマットでない場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '電話番号は不正な値です'

        inquiry.tel = ''
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }

        inquiry.tel = nil
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }

        inquiry.tel = '123456789011'
        inquiry.valid?
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }
      end
    end

    context 'Progressモデルに不正な値が与えられた場合' do
      it 'バリデーションに引っかかる' do
        expected_error = '進捗は不正な値です'

        inquiry.build_progress
        inquiry.progress.staff_id = -1
        is_asserted_by { !inquiry.valid? }
        is_asserted_by { inquiry.errors.full_messages.first == expected_error }
      end
    end
  end

  describe '# scopes' do
    let(:inquiry_with_progress) { create :inquiry, progress: build(:progress, staff_id: 2, state: 'waiting_recontact') }

    before do
      create_list :inquiry, 5, progress: build(:progress, staff_id: 1, state: 'waiting')
    end

    context 'company_name_cont' do
      it '会社名に対してLIKE検索できる' do
        inquiry = create :inquiry, company_name: 'company_name_cont_test'
        is_asserted_by { model.company_name_cont('ny_na').size == 1 }
      end
    end

    context 'name_cont' do
      it "顧客名に対してLIKE検索できる" do
        inquiry = create :inquiry, name: 'name_cont_test'
        is_asserted_by { model.name_cont('me_co').size == 1 }
      end
    end

    context 'email_cont' do
      it "Emailに対してLIKE検索できる" do
        inquiry = create :inquiry, email: 'email_cont_test@example.com'
        is_asserted_by { model.email_cont('l_con').size == 1 }
      end
    end

    context 'fields_cont' do
      it '会社名、顧客名、EmailのいずれかのカラムでLIKE検索に一致する結果を返す' do
        inquiry = create :inquiry, { company_name: 'fields_cont_test_company_name',
                                     name: 'fields_cont_test_name',
                                     email: 'fields_cont_test_email@example.com' }
        is_asserted_by { model.fields_cont('ds_cont_test_com').size == 1 }
        is_asserted_by { model.fields_cont('ds_cont_test_na').size == 1 }
        is_asserted_by { model.fields_cont('ds_cont_test_em').size == 1 }
      end
    end

    context 'state_eq' do
      it '紐づくProgressのstateの値に一致する結果を返す' do
        inquiry_with_progress
        is_asserted_by { model.state_eq('waiting_recontact').size == 1 }
      end
    end

    context 'staff_eq' do
      it '紐づくProgressのstaff_idの値に一致する結果を返す' do
        inquiry_with_progress
        is_asserted_by { model.staff_eq(2).size == 1 }
      end
    end
  end

  describe '# init_progress' do
    context 'Progressモデルが紐付いていない場合' do
      let(:inquiry) { build :inquiry }

      it 'Progressインスタンスを生成してから保存される' do
        expect { inquiry.save! }.to change { inquiry.progress.present? }.from(false).to(true)
      end
    end
  end

  describe '# ref_user_id_to_comments' do
    context 'user_idが更新された場合' do
      let(:inquiry) { create :inquiry }
      let(:comments) { create_list :comment, 3, inquiry: inquiry }

      it '紐づくCommentすべてのuser_idも連動して変更される' do
        new_user_id = inquiry.user_id + 1
        inquiry.update user_id: new_user_id
        is_asserted_by { comments.map(&:reload).map(&:user_id) == 3.times.map { new_user_id } }
      end
    end
  end
end
