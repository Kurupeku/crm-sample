module Types
  class ProgressType < Types::BaseObject
    key fields: 'id'

    field :id, ID, null: false
    field :staff_id, Integer, null: true
    field :inquiry_id, Integer, null: false

    field :inquiry, InquiryType, null: false
    def inquiry
      object.inquiry
    end

    field :rank, String, null: false
    def rank
      object.rank_i18n
    end

    field :state, String, null: true
    def state
      object.state_i18n
    end

    field :recontacted_on, String, null: true
    def recontacted_on
      object.recontacted_on&.strftime
    end

    field :contacted_at, Int, null: true
    def contacted_at
      object.contacted_at.to_i if object.contacted_at.present?
    end

    field :created_at, Int, null: false
    def created_at
      object.created_at.to_i
    end

    field :updated_at, Int, null: false
    def updated_at
      object.updated_at.to_i
    end

    field :selectable_events, [ProgressEventType], null: false
    def selectable_events
      object.selectable_events
    end

    field :staff, StaffType, null: true
    def staff
      return nil if object.staff_id.nil?

      { __typename: StaffType, id: object.staff_id }
    end

    def self.resolve_reference(reference, _context)
      Progress.find reference[:id]
    end
  end
end
