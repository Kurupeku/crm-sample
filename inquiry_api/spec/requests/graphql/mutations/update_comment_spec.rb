# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateComment, type: :request do
  let(:comment) { create :comment }
  let(:comment_attributes) { comment.attributes.symbolize_keys }
  def input(comment)
    <<~INPUT
      mutation {
        updateComment(input: {
          #{comment[:id].present? ? "id: #{comment[:id]}," : nil}
          content: "#{comment[:content]}"
        }) {
          id
          content
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが更新される' do
      new_content = 'asserted_text'
      result = AppSchema.execute input(comment_attributes.merge({ content: new_content }))
      is_asserted_by { result.dig('data', 'updateComment', 'content') == new_content }
      is_asserted_by { comment.reload.content == new_content }
    end
  end

  describe 'バリデーションに引っかかった場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      before_content = comment.content
      result = AppSchema.execute input(comment_attributes.merge({ content: nil }))
      is_asserted_by { result.key?('errors') }
      is_asserted_by { comment.reload.content == before_content }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは更新されない' do
      result = AppSchema.execute input(comment_attributes.merge({ id: 0 }))
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Comment.find(comment.id).present? }
    end
  end
end
