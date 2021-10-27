package entity

import (
	"time"
)

type Inquiry struct {
	ID               uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt        time.Time `gorm:"autoCreateTime"`
	UpdatedAt        time.Time `gorm:"autoUpdateTime"`
	UserID           uint
	CompanyName      string `csv:"company_name,omitempty"`
	Name             string `gorm:"not null" csv:"name"`
	Email            string `gorm:"not null" csv:"email"`
	Tel              string `gorm:"not null" csv:"tel"`
	NumberOfUsers    uint   `gorm:"not null" csv:"number_of_users"`
	IntroductoryTerm string `gorm:"not null" csv:"introductory_term"`
	Detail           string `gorm:"type:text" csv:"detail,omitempty"`
	Progress         Progress
	Comments         []Comment
}

type Progress struct {
	ID            uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt     time.Time `gorm:"autoCreateTime"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime"`
	InquiryID     uint
	StaffID       uint
	Rank          uint    `gorm:"not null;default:0" csv:"rank"`
	State         string  `gorm:"not null;default:'waiting'" csv:"state"`
	RecontactedOn *string `gorm:"type:date"`
	ContactedAt   *time.Time
}

type Comment struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	StaffID   uint
	UserID    uint
	InquiryID uint
	Content   string `gorm:"type:text" csv:"content,omitempty"`
}

type Menu struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
	Name        string    `gorm:"not null"`
	PublishedOn time.Time `gorm:"type:date"`
}

type MenuInquiryAttachment struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	MenuID    uint
	InquiryID uint
}
