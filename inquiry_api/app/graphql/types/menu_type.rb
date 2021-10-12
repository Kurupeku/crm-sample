module Types
  class MenuType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false

    field :inquiries, [InquiryType], null: false
    def inquiries
      object.inquiries
    end

    field :published_on, String, null: true
    def published_on
      object.published_on.strftime
    end

    field :created_at, Int, null: false
    def created_at
      object.created_at.to_i
    end

    field :updated_at, Int, null: false
    def updated_at
      object.updated_at.to_i
    end
  end
end
