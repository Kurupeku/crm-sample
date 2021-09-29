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
class Progress < ApplicationRecord
  include AASM

  attr_reader :event_log

  belongs_to :inquiry

  enum rank: { d: 0, c: 1, b: 2, a: 3 }

  aasm whiny_transitions: false do
    state :waiting, initial: true
    state :waiting_recontact
    state :contacting
    state :estimating
    state :archived
    state :ordered

    after_all_transitions :state_changed
    error_on_all_events :state_denied

    event :contact do
      transitions from: :waiting,
                  to: :contacting
    end

    event :recontact do
      transitions from: :waiting_recontact,
                  to: :contacting
    end

    event :contacted do
      transitions from: %i[waiting waiting_recontact contacting],
                  to: :estimating
    end

    event :archive do
      transitions from: %i[waiting waiting_recontact contacting],
                  to: :archived
    end

    event :order do
      transitions from: %i[estimating archived],
                  to: :archived
    end
  end

  def status_changed
    @event_log = I18n.t :status_denied,
                        scope: %i[active_record logs messages],
                        to_state: :aasm.to_state
  end

  def state_changed
    message = I18n.t :status_denied,
                     scope: %i[active_record errors messages]
    errors.add :base, message
  end
end
