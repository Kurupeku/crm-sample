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
class Comment < ApplicationRecord
  before_validation :set_user_id

  belongs_to :inquiry

  with_options presence: true do
    validates :user_id,
              numericality: { only_integer: true, greater_than: 0 }
    validates :content
  end

  private

  def set_user_id
    return if inquiry.blank? || inquiry.user_id.blank?

    self.user_id = inquiry.user_id
  end
end
