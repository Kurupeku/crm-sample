# == Schema Information
#
# Table name: comments
#
#  id         :bigint           not null, primary key
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  inquiry_id :bigint           not null
#  staff_id   :integer          not null
#  user_id    :integer          not null
#
# Indexes
#
#  index_comments_on_inquiry_id  (inquiry_id)
#  index_comments_on_staff_id    (staff_id)
#  index_comments_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (inquiry_id => inquiries.id)
#
class Comment < ApplicationRecord
  before_validation :set_user_id

  belongs_to :inquiry

  validates :content, presence: true
  with_options numericality: { only_integer: true, greater_than: 0 } do
    validates :staff_id, presence: true
    validates :user_id, allow_nil: true
  end

  private

  def set_user_id
    return if inquiry.blank? || inquiry.user_id.blank?

    self.user_id = inquiry.user_id
  end
end
