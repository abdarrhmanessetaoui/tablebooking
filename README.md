
tablebooking                                                                      //
├─ Administrateur-Restaurant                                                      //
│  ├─ backend                                                                     //
│  │  └─ administrateur-restaurant                                                //
│  │     ├─ .editorconfig                                                         //
│  │     ├─ .env                                                                  //
│  │     ├─ .env.example                                                          //
│  │     ├─ app                                                                   //
│  │     │  ├─ Console                                                            //
│  │     │  │  └─ Commands                                                        //
│  │     │  │     └─ CancelExpiredReservations.php                                //
│  │     │  ├─ Http                                                               //
│  │     │  │  ├─ Controllers                                                     //
│  │     │  │  │  ├─ Auth                                                         //
│  │     │  │  │  │  ├─ AuthenticatedSessionController.php                        //
│  │     │  │  │  │  ├─ EmailVerificationNotificationController.php               //
│  │     │  │  │  │  ├─ NewPasswordController.php                                 //
│  │     │  │  │  │  ├─ PasswordResetLinkController.php                           //
│  │     │  │  │  │  ├─ RegisteredUserController.php                              //
│  │     │  │  │  │  └─ VerifyEmailController.php                                 //
│  │     │  │  │  ├─ BlockedDateController.php                                    //
│  │     │  │  │  ├─ Controller.php                                               //
│  │     │  │  │  ├─ RestaurantReservationController.php                          //
│  │     │  │  │  ├─ ServiceController.php                                        //
│  │     │  │  │  ├─ TableController.php                                          //
│  │     │  │  │  └─ TimeSlotController.php                                       //
│  │     │  │  ├─ Middleware                                                      //
│  │     │  │  │  └─ EnsureEmailIsVerified.php                                    //
│  │     │  │  └─ Requests                                                        //
│  │     │  │     └─ Auth                                                         //
│  │     │  │        └─ LoginRequest.php                                          //
│  │     │  ├─ Models                                                             //
│  │     │  │  ├─ BlockedDate.php                                                 //
│  │     │  │  ├─ User.php                                                        //
│  │     │  │  ├─ WpForm.php                                                      //
│  │     │  │  └─ WpMessage.php                                                   //
│  │     │  └─ Providers                                                          //
│  │     │     └─ AppServiceProvider.php                                          //
│  │     ├─ artisan                                                               //
│  │     ├─ bootstrap                                                             //
│  │     │  ├─ app.php                                                            //
│  │     │  └─ providers.php                                                      //
│  │     ├─ composer.json                                                         //
│  │     ├─ composer.lock                                                         //
│  │     ├─ config                                                                //
│  │     │  ├─ app.php                                                            //
│  │     │  ├─ auth.php                                                           //
│  │     │  ├─ cache.php                                                          //
│  │     │  ├─ cors.php                                                           //
│  │     │  ├─ database.php                                                       //
│  │     │  ├─ filesystems.php                                                    //
│  │     │  ├─ logging.php                                                        //
│  │     │  ├─ mail.php                                                           //
│  │     │  ├─ queue.php                                                          //
│  │     │  ├─ sanctum.php                                                        //
│  │     │  ├─ services.php                                                       //
│  │     │  └─ session.php                                                        //
│  │     ├─ database                                                              //
│  │     │  ├─ database.sqlite                                                    //
│  │     │  ├─ factories                                                          //
│  │     │  │  ├─ ReservationFactory.php                                          //
│  │     │  │  └─ UserFactory.php                                                 //
│  │     │  ├─ migrations                                                         //
│  │     │  │  ├─ 0001_01_01_000000_create_users_table.php                        //
│  │     │  │  ├─ 0001_01_01_000001_create_cache_table.php                        //
│  │     │  │  ├─ 0001_01_01_000002_create_jobs_table.php                         //
│  │     │  │  ├─ 2024_01_01_000000_add_table_idx_to_wpjn_messages.php            //
│  │     │  │  ├─ 2026_03_03_222536_create_personal_access_tokens_table.php       //
│  │     │  │  ├─ 2026_03_05_004651_add_restaurant_form_id_to_users_table.php     //
│  │     │  │  ├─ 2026_03_06_120637_create_blocked_dates_table.php                //
│  │     │  │  └─ 2026_03_08_063612_drop_blocked_dates_table.php                  //
│  │     │  └─ seeders                                                            //
│  │     │     ├─ DatabaseSeeder.php                                              //
│  │     │     └─ ReservationSeeder.php                                           //
│  │     ├─ package-lock.json                                                     //
│  │     ├─ package.json                                                          //
│  │     ├─ phpunit.xml                                                           //
│  │     ├─ public                                                                //
│  │     │  ├─ .htaccess                                                          //
│  │     │  ├─ favicon.ico                                                        //
│  │     │  ├─ index.php                                                          //
│  │     │  └─ robots.txt                                                         //
│  │     ├─ README.md                                                             //
│  │     ├─ resources                                                             //
│  │     │  └─ views                                                              //
│  │     ├─ routes                                                                //
│  │     │  ├─ api.php                                                            //
│  │     │  ├─ auth.php                                                           //
│  │     │  ├─ console.php                                                        //
│  │     │  └─ web.php                                                            //
│  │     ├─ tablebooking                                                          //
│  │     └─ tests                                                                 //
│  │        ├─ Feature                                                            //
│  │        │  ├─ Auth                                                            //
│  │        │  │  ├─ AuthenticationTest.php                                       //
│  │        │  │  ├─ EmailVerificationTest.php                                    //
│  │        │  │  ├─ PasswordResetTest.php                                        //
│  │        │  │  └─ RegistrationTest.php                                         //
│  │        │  └─ ExampleTest.php                                                 //
│  │        ├─ TestCase.php                                                       //
│  │        └─ Unit                                                               //
│  │           └─ ExampleTest.php                                                 //
│  └─ frontend                                                                    //
│     └─ administrateur-restaurant                                                //
│        ├─ eslint.config.js                                                      //
│        ├─ index.html                                                            //
│        ├─ package-lock.json                                                     //
│        ├─ package.json                                                          //
│        ├─ postcss.config.js                                                     //
│        ├─ public                                                                //
│        │  └─ images                                                             //
│        │     ├─ icon.png                                                        //
│        │     └─ tablebooking.png                                                //
│        ├─ README.md                                                             //
│        ├─ src                                                                   //
│        │  ├─ App.jsx                                                            //
│        │  ├─ assets                                                             //
│        │  ├─ components                                                         //
│        │  │  ├─ BlockedDates                                                    //
│        │  │  │  ├─ BlockedDateForm.jsx                                          //
│        │  │  │  └─ BlockedDateList.jsx                                          //
│        │  │  ├─ Calendar                                                        //
│        │  │  │  ├─ CalendarNav.jsx                                              //
│        │  │  │  └─ CalendarWeek.jsx                                             //
│        │  │  ├─ Dashboard                                                       //
│        │  │  │  ├─ Badge.jsx                                                    //
│        │  │  │  ├─ Btn.jsx                                                      //
│        │  │  │  ├─ Card.jsx                                                     //
│        │  │  │  ├─ DashboardReservationsTable.jsx                               //
│        │  │  │  ├─ FadeUp.jsx                                                   //
│        │  │  │  ├─ IBox.jsx                                                     //
│        │  │  │  ├─ LiveClock.jsx                                                //
│        │  │  │  ├─ ResCardMobile.jsx                                            //
│        │  │  │  ├─ ResRow.jsx                                                   //
│        │  │  │  ├─ Ring.jsx                                                     //
│        │  │  │  ├─ Spinner.jsx                                                  //
│        │  │  │  ├─ StatBlock.jsx                                                //
│        │  │  │  └─ TabPanel.jsx                                                 //
│        │  │  ├─ Layout.jsx                                                      //
│        │  │  ├─ ProtectedRoute.jsx                                              //
│        │  │  ├─ Reports                                                         //
│        │  │  │  ├─ BarChart.jsx                                                 //
│        │  │  │  └─ ReportsFilters.jsx                                           //
│        │  │  ├─ Reservations                                                    //
│        │  │  │  ├─ AssignTableModal.jsx                                         //
│        │  │  │  ├─ ReservationModal                                             //
│        │  │  │  │  ├─ index.jsx                                                 //
│        │  │  │  │  ├─ MiniCalendar.jsx                                          //
│        │  │  │  │  ├─ ModalHeader.jsx                                           //
│        │  │  │  │  ├─ modes                                                     //
│        │  │  │  │  │  ├─ EditMode.jsx                                           //
│        │  │  │  │  │  └─ ViewMode.jsx                                           //
│        │  │  │  │  ├─ ServiceInfoCard.jsx                                       //
│        │  │  │  │  ├─ steps                                                     //
│        │  │  │  │  │  ├─ StepContact.jsx                                        //
│        │  │  │  │  │  ├─ StepDateTime.jsx                                       //
│        │  │  │  │  │  └─ StepService.jsx                                        //
│        │  │  │  │  └─ TimeSlotPicker.jsx                                        //
│        │  │  │  ├─ ReservationModal.jsx                                         //
│        │  │  │  ├─ ReservationsFilters                                          //
│        │  │  │  │  └─ index.jsx                                                 //
│        │  │  │  ├─ ReservationsFilters.jsx                                      //
│        │  │  │  ├─ ReservationsTable                                            //
│        │  │  │  │  ├─ ActionBtn.jsx                                             //
│        │  │  │  │  ├─ AssignTableCell.jsx                                       //
│        │  │  │  │  ├─ Checkbox.jsx                                              //
│        │  │  │  │  ├─ DesktopTable.jsx                                          //
│        │  │  │  │  ├─ index.jsx                                                 //
│        │  │  │  │  ├─ MobileCard.jsx                                            //
│        │  │  │  │  ├─ MobileCards.jsx                                           //
│        │  │  │  │  ├─ Pagination.jsx                                            //
│        │  │  │  │  └─ TableRow.jsx                                              //
│        │  │  │  ├─ ReservationsTable.jsx                                        //
│        │  │  │  └─ shared                                                       //
│        │  │  │     ├─ InfoRow.jsx                                               //
│        │  │  │     ├─ Label.jsx                                                 //
│        │  │  │     ├─ StatusBadge.jsx                                           //
│        │  │  │     └─ TextInput.jsx                                             //
│        │  │  ├─ Services                                                        //
│        │  │  │  ├─ ServiceForm.jsx                                              //
│        │  │  │  └─ ServiceList.jsx                                              //
│        │  │  ├─ Sidebar.jsx                                                     //
│        │  │  ├─ Tables                                                          //
│        │  │  │  ├─ TableForm.jsx                                                //
│        │  │  │  ├─ TableList.jsx                                                //
│        │  │  │  └─ TableTimeline.jsx                                            //
│        │  │  └─ ui                                                              //
│        │  │     ├─ ConfirmDialog.jsx                                            //
│        │  │     └─ Toast.jsx                                                    //
│        │  ├─ data                                                               //
│        │  │  └─ sidebarItems.jsx                                                //
│        │  ├─ hooks                                                              //
│        │  │  ├─ BlockedDates                                                    //
│        │  │  │  └─ useBlockedDates.js                                           //
│        │  │  ├─ Calendar                                                        //
│        │  │  │  └─ useCalendar.js                                               //
│        │  │  ├─ Dashboard                                                       //
│        │  │  │  ├─ useCountUp.js                                                //
│        │  │  │  ├─ useDashboard.js                                              //
│        │  │  │  └─ useDashboardStats.js                                         //
│        │  │  ├─ Reports                                                         //
│        │  │  │  └─ useReports.js                                                //
│        │  │  ├─ Reservations                                                    //
│        │  │  │  ├─ useModalData.js                                              //
│        │  │  │  ├─ useReservations.js                                           //
│        │  │  │  ├─ useservices.js                                               //
│        │  │  │  └─ useTimeSlots.js                                              //
│        │  │  ├─ Services                                                        //
│        │  │  │  └─ useServices.js                                               //
│        │  │  ├─ Tables                                                          //
│        │  │  │  ├─ useTables.js                                                 //
│        │  │  │  └─ useTablesTimeline.js                                         //
│        │  │  ├─ useLogin.js                                                     //
│        │  │  ├─ useRestaurantInfo.js                                            //
│        │  │  └─ useRestaurantSettings.js                                        //
│        │  ├─ index.css                                                          //
│        │  ├─ main.jsx                                                           //
│        │  ├─ pages                                                              //
│        │  │  ├─ BlockedDates.jsx                                                //
│        │  │  ├─ Calendar.jsx                                                    //
│        │  │  ├─ Dashboard.jsx                                                   //
│        │  │  ├─ Login.jsx                                                       //
│        │  │  ├─ Reports.jsx                                                     //
│        │  │  ├─ Reservations.jsx                                                //
│        │  │  ├─ Services.jsx                                                    //
│        │  │  ├─ Settings.jsx                                                    //
│        │  │  └─ Tables.jsx                                                      //
│        │  ├─ styles                                                             //
│        │  │  ├─ dashboard                                                       //
│        │  │  │  ├─ badge.styles.js                                              //
│        │  │  │  ├─ dashboard.styles.js                                          //
│        │  │  │  ├─ resCardMobile.styles.js                                      //
│        │  │  │  ├─ reservationsTable.styles.js                                  //
│        │  │  │  ├─ resRow.styles.js                                             //
│        │  │  │  ├─ ring.styles.js                                               //
│        │  │  │  ├─ statBlock.styles.js                                          //
│        │  │  │  ├─ tabPanel.styles.js                                           //
│        │  │  │  └─ tokens.js                                                    //
│        │  │  └─ reservations                                                    //
│        │  │     ├─ filters.styles.js                                            //
│        │  │     ├─ modal.styles.js                                              //
│        │  │     ├─ table.styles.js                                              //
│        │  │     └─ tokens.js                                                    //
│        │  └─ utils                                                              //
│        │     ├─ auth.js                                                         //
│        │     ├─ brand.js                                                        //
│        │     └─ Exportpdf.js                                                    //
│        ├─ tailwind.config.js                                                    //
│        └─ vite.config.js                                                        //
└─ README.md                                                                      //

```