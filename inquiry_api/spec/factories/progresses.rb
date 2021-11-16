# == Schema Information
#
# Table name: progresses
#
#  id             :bigint           not null, primary key
#  contacted_at   :datetime
#  rank           :integer          default("d"), not null
#  recontacted_on :date
#  state          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  inquiry_id     :bigint           not null
#  staff_id       :integer
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

    staff_id { [1, 2, 3].sample }
    rank { %w[a b c d].sample }
    state { %i[waiting waiting_recontact contacting estimating archived ordered].sample }
  end
end
