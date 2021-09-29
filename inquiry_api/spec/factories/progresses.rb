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
    association :inquiry

    rank { 0 }
    contacted_at { nil }
    recontacted_on { nil }
  end
end
