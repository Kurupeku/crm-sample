# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::CreateComment, type: :request do
  let(:inquiry) { create :inquiry }
  let(:comment_attributes) { attributes_for :comment, inquiry_id: inquiry.id }
  def input(comment)
    <<~INPUT
      mutation {
        createComment(input: {
          #{comment[:staff_id].present? ? "staffId: #{comment[:staff_id]}," : nil}
          #{comment[:inquiry_id].present? ? "inquiryId: #{comment[:inquiry_id]}," : nil}
          content: "#{comment[:content]}"
        }) {
          id
          content
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが作成される' do
      result = AppSchema.execute input(comment_attributes)
      is_asserted_by { result.dig('data', 'createComment', 'content') == comment_attributes[:content] }
      is_asserted_by { Comment.first.content == comment_attributes[:content] }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは作成されない' do
      result = AppSchema.execute input(comment_attributes.merge({ content: nil }))
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Comment.all.size.zero? }
    end
  end
end
