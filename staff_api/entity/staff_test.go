package entity

import (
	"fmt"
	"log"
	"os"
	"testing"

	"staff_api/database"

	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestMain(m *testing.M) {
	os.Setenv("GO_ENV", "test")
	db, err := database.Connect()
	if err != nil {
		log.Panic(err)
	}

	err = db.AutoMigrate(&Staff{})
	if err != nil {
		log.Panic(err)
	}

	code := m.Run()

	cleanStaffs()

	os.Exit(code)
}

func TestAllStaffs(t *testing.T) {
	size := 10
	createStaffs(t, size)
	defer cleanStaffs()

	staffs, err := AllStaffs()
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, size, len(staffs))
}

func TestPaginatedStaffs(t *testing.T) {
	createStaffs(t, 30)
	defer cleanStaffs()

	limit := 25
	offset := 0
	staffs, err := PaginatedStaffs(limit, offset)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, limit, len(staffs))

	offset = 25
	staffs, err = PaginatedStaffs(limit, offset)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, 5, len(staffs))

	limit = -2
	offset = 0
	_, err = PaginatedStaffs(limit, offset)

	assert.Error(t, err)

	limit = 25
	offset = -1
	_, err = PaginatedStaffs(limit, offset)

	assert.Error(t, err)
}

func TestGetPageInfo(t *testing.T) {
	createStaffs(t, 30)
	defer cleanStaffs()

	per := 25
	page := 1
	info, err := GetPageInfo(per, page)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, PageInfo{
		CurrentPage:  1,
		RecordsCount: 30,
		PagesCount:   2,
		Limit:        25,
	}, *info)

	per = 10
	info, err = GetPageInfo(per, page)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, PageInfo{
		CurrentPage:  1,
		RecordsCount: 30,
		PagesCount:   3,
		Limit:        10,
	}, *info)

	page = 3
	info, err = GetPageInfo(per, page)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, PageInfo{
		CurrentPage:  3,
		RecordsCount: 30,
		PagesCount:   3,
		Limit:        10,
	}, *info)

	per = -1
	_, err = GetPageInfo(per, page)

	assert.Error(t, err)

	per = 25
	page = -1
	_, err = GetPageInfo(per, page)

	assert.Error(t, err)
}

func TestFindStaffByID(t *testing.T) {
	s := createStaff(t)
	defer cleanStaffs()

	var staff Staff
	staff.FindStaffByID(fmt.Sprintf("%d", s.ID))

	assert.Equal(t, s.PasswordDigest, staff.PasswordDigest)

	staff = Staff{}
	err := staff.FindStaffByID("0")

	assert.Error(t, err)
}

func TestFindStaffByEmail(t *testing.T) {
	s := createStaff(t)
	defer cleanStaffs()

	var staff Staff
	staff.FindStaffByEmail(s.Email)

	assert.Equal(t, s.PasswordDigest, staff.PasswordDigest)

	staff = Staff{}
	err := staff.FindStaffByEmail("test")

	assert.Error(t, err)
}

func TestCreate(t *testing.T) {
	defer cleanStaffs()

	var staff Staff

	name := "テスト"
	email := "test100000@example.com"
	password := "password"
	bs := getRecordSize()
	staff.Create(name, email, password)

	assert.Equal(t, bs+1, getRecordSize())

	staff = Staff{}
	name = ""
	err := staff.Create(name, email, password)

	assert.Error(t, err)

	staff = Staff{}
	name = "テスト"
	email = "test100000"
	err = staff.Create(name, email, password)

	assert.Error(t, err)

	staff = Staff{}
	email = "test100000@example.com"
	password = "pass"
	err = staff.Create(name, email, password)

	assert.Error(t, err)
}

func TestUpdate(t *testing.T) {
	s := createStaff(t)
	defer cleanStaffs()

	id := fmt.Sprintf("%d", s.ID)

	var staff Staff

	name := "テスト"
	email := "test100000@example.com"
	staff.Update(id, &name, &email)

	assert.Equal(t, email, staff.Email)

	var fs Staff
	database.GetDB().First(&fs, id)

	assert.Equal(t, email, fs.Email)

	name = ""
	err := staff.Update(id, &name, &email)

	assert.Error(t, err)

	name = "テスト"
	email = "test100000"
	err = staff.Update(id, &name, &email)

	assert.Error(t, err)
}

func TestDelete(t *testing.T) {
	s := createStaff(t)
	defer cleanStaffs()

	var staff Staff

	id := "0"
	err := staff.Delete(id)

	assert.Error(t, err)

	id = fmt.Sprintf("%d", s.ID)
	staff = Staff{}
	staff.Delete(id)

	assert.Equal(t, int64(0), database.GetDB().First(&Staff{}, s.ID).RowsAffected)
}

func TestChangeIcon(t *testing.T) {
	s := createStaff(t)
	defer cleanStaffs()

	id := fmt.Sprintf("%d", s.ID)

	var staff Staff
	iconStr := "testimagestring"
	staff.UpdateIcon(id, iconStr)

	assert.Equal(t, iconStr, staff.Icon)

	var fs Staff
	database.GetDB().First(&fs, id)

	assert.Equal(t, iconStr, fs.Icon)

	staff = Staff{}
	staff.DeleteIcon(id)

	assert.Equal(t, "", staff.Icon)

	fs = Staff{}
	database.GetDB().First(&fs, id)

	assert.Equal(t, "", fs.Icon)
}

func TestChangePassword(t *testing.T) {
	s := createStaff(t)
	defer cleanStaffs()

	id := fmt.Sprintf("%d", s.ID)

	var staff Staff
	cps := "password"
	nps := "newpassword"
	staff.ChangePassword(id, cps, nps)

	assert.Equal(
		t,
		nil,
		bcrypt.CompareHashAndPassword(staff.PasswordDigest, []byte(nps)),
	)

	var fs Staff
	database.GetDB().First(&fs, id)

	assert.Equal(
		t,
		nil,
		bcrypt.CompareHashAndPassword(fs.PasswordDigest, []byte(nps)),
	)

	staff = Staff{}
	cps = nps
	nps = "pass"
	err := staff.ChangePassword(id, cps, nps)

	assert.Error(t, err)
}

func TestIsAuthenticated(t *testing.T) {
	s := createStaff(t)
	defer cleanStaffs()

	e := s.Email
	p := "password"

	var staff Staff
	assert.Equal(t, true, staff.IsAuthenticated(e, p))

	staff = Staff{}
	p = "incorrectpassword"
	assert.Equal(t, false, staff.IsAuthenticated(e, p))
}

var staffCreatedTimes = 1000

func createStaff(t *testing.T) Staff {
	hashed, _ := bcrypt.GenerateFromPassword([]byte("password"), 10)
	staff := Staff{
		Name:           fmt.Sprintf("テスト%d", staffCreatedTimes),
		Email:          fmt.Sprintf("test%d@example.com", staffCreatedTimes),
		PasswordDigest: hashed,
	}

	if err := database.GetDB().Create(&staff).Error; err != nil {
		log.Fatal(err)
	}

	staffCreatedTimes++

	return staff
}

func createStaffs(t *testing.T, size int) []Staff {
	cleanStaffs()
	if size < 1 {
		return []Staff{}
	}

	var staffs []Staff
	hashed, _ := bcrypt.GenerateFromPassword([]byte("password"), 10)
	for i := 1; i <= size; i++ {
		staffs = append(staffs, Staff{
			Name:           fmt.Sprintf("テスト%d", i),
			Email:          fmt.Sprintf("test%d@example.com", i),
			PasswordDigest: hashed,
		})
	}

	if err := database.GetDB().Create(&staffs).Error; err != nil {
		t.Fatal(err)
	}

	return staffs
}

func getRecordSize() int64 {
	var staffs []Staff
	return database.GetDB().Find(&staffs).RowsAffected
}

func cleanStaffs() {
	database.GetDB().Exec("DELETE FROM staffs")
}
