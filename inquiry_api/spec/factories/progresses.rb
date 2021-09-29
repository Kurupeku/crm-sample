# == Schema Information
#
# Table name: progresses
#
#  id             :bigint           not null, primary key
#  aasm_state     :string
#  contacted_at   :datetime
#  rank           :integer          default("d"), not null
#  recontacted_on :date
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  inquiry_id     :bigint           not null
#
# Indexes
#
#  index_progresses_on_inquiry_id  (inquiry_id)
#
# Foreign Keys
#
#  fk_rails_...  (inquiry_id => inquiries.id)
#
FactoryBot.define do
  factory :progress do
    inquiry { nil }
    rank { 1 }
    status { 1 }
    contacted_at { "2021-09-29 16:50:47" }
    recontacted_on { "2021-09-29" }
  end
end
