module Mutations
  class CreateMenu < BaseMutation
    argument :name, String, required: true
    argument :published_on, String, required: false

    type Types::MenuType

    def resolve(name:, published_on:)
      Menu.create! name: name,
                   published_on: Date.parse(published_on)
    end
  end
end
