# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_09_30_115338) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.bigint "inquiry_id", null: false
    t.integer "user_id", null: false
    t.text "content", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["inquiry_id"], name: "index_comments_on_inquiry_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "inquiries", force: :cascade do |t|
    t.integer "user_id"
    t.string "company_name"
    t.string "name", null: false
    t.string "email", null: false
    t.string "tel", null: false
    t.integer "number_of_users", null: false
    t.string "introductory_term", null: false
    t.text "detail"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "menu_inquiry_attachments", force: :cascade do |t|
    t.bigint "menu_id", null: false
    t.bigint "inquiry_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["inquiry_id"], name: "index_menu_inquiry_attachments_on_inquiry_id"
    t.index ["menu_id"], name: "index_menu_inquiry_attachments_on_menu_id"
  end

  create_table "menus", force: :cascade do |t|
    t.string "name", null: false
    t.date "published_on"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "progresses", force: :cascade do |t|
    t.bigint "inquiry_id", null: false
    t.integer "rank", default: 0, null: false
    t.datetime "contacted_at"
    t.date "recontacted_on"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "state"
    t.integer "staff_id"
    t.index ["inquiry_id"], name: "index_progresses_on_inquiry_id"
  end

  add_foreign_key "comments", "inquiries"
  add_foreign_key "menu_inquiry_attachments", "inquiries"
  add_foreign_key "menu_inquiry_attachments", "menus"
  add_foreign_key "progresses", "inquiries"
end
