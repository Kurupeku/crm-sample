module Mutations
  class DeleteMenu < BaseMutation
    argument :id, ID, required: true
    type Types::MenuType

    def resolve(id:)
      menu = Menu.find(id)
      menu.destroy! && menu
    end
  end
end
