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
FactoryBot.define do
  factory :comment do
    association :inquiry

    staff_id { 1 }
    user_id { 1 }
    content { Faker::Lorem.paragraphs.join("\n") }
  end
end
