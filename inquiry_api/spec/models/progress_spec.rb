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
require 'rails_helper'

RSpec.describe Progress, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
