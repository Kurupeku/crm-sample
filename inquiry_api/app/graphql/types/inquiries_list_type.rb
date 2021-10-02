module Types
  class InquiriesListType < Types::BaseObject
    field :inquiries, [InquiryType], null: false
    field :page_info, PageInfoType, null: false
  end
end
