module Mutations
  class UpdateMenu < BaseMutation
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :published_on, String, required: false

    type Types::MenuType

    def resolve(id:, **args)
      menu = Menu.find id
      menu.update!(params(args)) && menu
    end
  end
end
