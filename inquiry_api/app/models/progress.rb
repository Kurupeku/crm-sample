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
class Progress < ApplicationRecord
  include AASM

  attr_reader :event_log

  belongs_to :inquiry

  enum rank: { d: 0, c: 1, b: 2, a: 3 }

  validates :staff_id, numericality: {
    integer: true,
    greater_than: 0
  }, allow_nil: true

  aasm column: :state do
    state :waiting, initial: true
    state :waiting_recontact
    state :contacting
    state :estimating
    state :archived
    state :ordered

    after_all_transitions :state_changed
    error_on_all_events :state_denied

    event :contact do
      transitions from: %i[waiting waiting_recontact],
                  to: :contacting
    end

    event :recontact do
      transitions from: %i[waiting contacting],
                  to: :waiting_recontact
    end

    event :contacted do
      transitions from: %i[waiting waiting_recontact contacting],
                  to: :estimating
    end

    event :archive do
      transitions from: %i[waiting waiting_recontact contacting estimating],
                  to: :archived
    end

    event :order do
      transitions from: %i[estimating archived],
                  to: :ordered
    end
  end

  scope :rank_eq, lambda { |value|
    return all if value.blank?

    send value
  }

  scope :state_eq, lambda { |value|
    return all if value.blank?

    send value
  }

  scope :staff_eq, lambda { |staff_id|
    return all if staff_id.blank?

    where staff_id: staff_id
  }

  def state_i18n
    I18n.t state.to_sym,
           scope: %i[activerecord attributes progress state]
  end

  def selectable_events
    %i[contact recontact contacted archive order].select do |event|
      send "may_#{event}?"
    end.map do |event|
      { label: event_i18n(event), event: event }
    end
  end

  def asign_recontacted_on!(date)
    if waiting_recontact?
      update! recontacted_on: Date.parse(date)
    else
      message = I18n.t :present,
                       scope: %i[errors messages]
      errors.add :recontacted_on, message
      raise ActiveRecord::RecordInvalid, self
    end
  end

  private

  def event_i18n(event)
    I18n.t event.to_sym,
           scope: %i[activerecord attributes progress event]
  end

  def state_changed
    self.recontacted_on = nil unless aasm.to_state != :waiting_recontact?

    message = I18n.t :status_changed,
                     scope: %i[activerecord logs messages],
                     to_state: aasm.to_state
    @event_log = message
  end

  def state_denied
    message = I18n.t :status_denied,
                     scope: %i[activerecord errors messages]
    errors.add :base, message
  end
end
