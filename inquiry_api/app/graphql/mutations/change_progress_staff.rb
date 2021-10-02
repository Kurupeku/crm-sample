module Mutations
  class ChangeProgressStaff < BaseMutation
    argument :id, ID, required: true
    argument :staff_id, Integer, required: true

    type Types::ProgressType

    def resolve(id:, staff_id:)
      menu = Menu.find id
      menu.update!(staff_id: staff_id) && menu
    end
  end
end
