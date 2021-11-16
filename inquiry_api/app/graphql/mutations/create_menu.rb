module Mutations
  class CreateMenu < BaseMutation
    argument :name, String, required: true
    argument :published_on, String, required: false

    type Types::MenuType

    def resolve(**args)
      menu = Menu.new name: args[:name]
      unless args.key?(:published_on)
        menu.published_on = (Date.parse(args[:published_on]) if args[:published_on].present?)
      end
      menu.save! && menu
    end
  end
end
