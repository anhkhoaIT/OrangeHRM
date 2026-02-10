Feature: Quản lý đăng nhập OrangeHRM

  Scenario Outline: Đăng nhập với nhiều trường hợp dữ liệu
    Given Tôi mở trang login của OrangeHRM
    When Tôi nhập username "<username>" và password "<password>"
    Then Tôi sẽ thấy kết quả là "<flag>" với tin nhắn "<errorMessage>"

    Examples:
      | username | password | flag    | errorMessage         |
      | Admin    | admin123 | Success |                      |
      | ADMIN    | admin123 | Success |                      |
      | Admin    | ADMIN123 | Failed  | Invalid credentials  |
      |          | admin123 | Failed  | Required             |
      | hehe     | admin123 | Failed  | Invalid credentials  |
      | Admin    | admin1234! | Failed| Invalid credentials  |