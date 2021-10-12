# == Schema Information
#
# Table name: comments
#
#  id         :bigint           not null, primary key
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  inquiry_id :bigint           not null
#  user_id    :integer          not null
#
# Indexes
#
#  index_comments_on_inquiry_id  (inquiry_id)
#  index_comments_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (inquiry_id => inquiries.id)
#
require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe '# validateions' do
    let(:comment) { build :comment }

    context 'contentが空の場合' do
      it 'バリデーションに弾かれる' do
        expected_error = '内容を入力してください'

        comment.content = ''
        comment.valid?
        is_asserted_by { comment.errors.full_messages.first == expected_error }

        comment.content = nil
        comment.valid?
        is_asserted_by { comment.errors.full_messages.first == expected_error }
      end
    end

    context 'user_idが空の場合' do
      it 'バリデーションに弾かれる' do
        expected_error = 'ユーザーIDを入力してください'

        comment.user_id = ''
        comment.valid?
        is_asserted_by { comment.errors.full_messages.first == expected_error }

        comment.user_id = nil
        comment.valid?
        is_asserted_by { comment.errors.full_messages.first == expected_error }
      end
    end

    context 'user_idが1未満もしくはInteger以外の場合' do
      it 'バリデーションに弾かれる' do
        comment.user_id = 0
        comment.valid?
        is_asserted_by { comment.errors.full_messages.first == 'ユーザーIDは0より大きい値にしてください' }

        comment.user_id = 1.1
        comment.valid?
        is_asserted_by { comment.errors.full_messages.first == 'ユーザーIDは整数で入力してください' }
      end
    end
  end
end
