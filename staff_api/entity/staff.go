package entity

import (
	"errors"
	"regexp"
	"time"

	"staff_api/database"

	"golang.org/x/crypto/bcrypt"
)

type Staff struct {
	ID             uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime"`
	Name           string    `gorm:"not null"`
	Email          string    `gorm:"uniqueIndex;not null"`
	PasswordDigest []byte    `gorm:"not null"`
	Icon           string    `gorm:"type:text"`
}

type PageInfo struct {
	CurrentPage  int
	RecordsCount int
	PagesCount   int
	Limit        int
}

func AllStaffs() ([]Staff, error) {
	db := database.GetDB()

	var staffs []Staff
	if err := db.Order("id").Find(&staffs).Error; err != nil {
		return nil, err
	}

	return staffs, nil
}

func PaginatedStaffs(lm int, of int) ([]Staff, error) {
	if lm < 0 {
		return nil, errors.New("表示件数は0以上である必要があります")
	}

	if of < 0 {
		return nil, errors.New("ページ数は1以上である必要があります")
	}

	db := database.GetDB()

	var staffs []Staff
	if err := db.Order("id").Limit(lm).Offset(of).Find(&staffs).Error; err != nil {
		return nil, err
	}

	return staffs, nil
}

func GetPageInfo(per int, page int) (*PageInfo, error) {
	if per < 0 {
		return nil, errors.New("表示件数は0以上である必要があります")
	}

	if page < 1 {
		return nil, errors.New("ページ数は1以上である必要があります")
	}

	staffs, err := AllStaffs()
	if err != nil {
		return nil, err
	}

	rc := len(staffs)
	pa := rc / per
	if pb := rc % per; pb > 0 {
		pa = pa + 1
	}

	return &PageInfo{
		CurrentPage:  page,
		RecordsCount: rc,
		PagesCount:   pa,
		Limit:        per,
	}, nil
}

func (s *Staff) FindStaffByID(id string) error {
	db := database.GetDB()
	result := db.First(s, id)

	if count := result.RowsAffected; count == 0 {
		return errors.New("対象のレコードは存在しません")
	}

	if err := result.Error; err != nil {
		return err
	}

	return nil
}

func (s *Staff) FindStaffByEmail(email string) error {
	db := database.GetDB()
	result := db.Where(Staff{Email: email}).First(s)

	if count := result.RowsAffected; count == 0 {
		return errors.New("対象のレコードは存在しません")
	}

	if err := result.Error; err != nil {
		return err
	}

	return nil
}

func (s *Staff) Create(name string, email string, password string) error {
	if isInvalidName(name) {
		return errors.New("名前は必須です")
	}

	if isInvalidEmail(email) {
		return errors.New("Emailの形式が正しくありません")
	}

	if isInvalidPassword(password) {
		return errors.New("パスワードは英数字8文字以上である必要があります")
	}

	db := database.GetDB()

	if count := db.Where("email = ?", email).Find(&Staff{}).RowsAffected; count > 0 {
		return errors.New("すでに同じEmailが登録されています")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return err
	}

	s.Name = name
	s.Email = email
	s.PasswordDigest = hashed

	if err := db.Create(s).Error; err != nil {
		return err
	}

	return nil
}

func (s *Staff) Update(id string, name *string, email *string) error {
	if name == nil && email == nil {
		return nil
	}

	params := map[string]interface{}{}

	if name != nil {
		if isInvalidName(*name) {
			return errors.New("名前は必須です")
		}

		params["name"] = *name
	}

	if email != nil {
		if isInvalidEmail(*email) {
			return errors.New("Emailの形式が正しくありません")
		}

		params["email"] = *email
	}

	if err := s.FindStaffByID(id); err != nil {
		return err
	}

	db := database.GetDB()
	if err := db.Model(s).Updates(params).Error; err != nil {
		return err
	}

	return nil
}

func (s *Staff) Delete(id string) error {
	if err := s.FindStaffByID(id); err != nil {
		return err
	}

	db := database.GetDB()
	if err := db.Delete(s, id).Error; err != nil {
		return err
	}

	return nil
}

func (s *Staff) UpdateIcon(id string, icon string) error {
	if err := s.FindStaffByID(id); err != nil {
		return err
	}

	db := database.GetDB()
	if err := db.Model(s).Update("icon", icon).Error; err != nil {
		return err
	}

	return nil
}

func (s *Staff) DeleteIcon(id string) error {
	if err := s.FindStaffByID(id); err != nil {
		return err
	}

	db := database.GetDB()
	if err := db.Model(s).Update("icon", nil).Error; err != nil {
		return err
	}

	return nil
}

func (s *Staff) ChangePassword(id string, current string, new string) error {
	if err := s.FindStaffByID(id); err != nil {
		return err
	}

	if err := s.comparePassword(current); err != nil {
		return err
	}

	if isInvalidPassword(new) {
		return errors.New("パスワードは英数字8文字以上である必要があります")
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(new), 10)
	if err != nil {
		return err
	}

	db := database.GetDB()
	if err := db.Model(s).Update("password_digest", newHash).Error; err != nil {
		return err
	}

	return nil
}

func (s Staff) comparePassword(p string) error {
	if bcrypt.CompareHashAndPassword(s.PasswordDigest, []byte(p)) != nil {
		return errors.New("パスワードが正しくありません")
	}

	return nil
}

func isInvalidName(n string) bool {
	return len(n) == 0
}

func isInvalidEmail(e string) bool {
	var r = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	return !r.MatchString(e)
}

func isInvalidPassword(p string) bool {
	var r = regexp.MustCompile("^[a-zA-Z0-9]{8,}$")
	return !r.MatchString(p)
}
