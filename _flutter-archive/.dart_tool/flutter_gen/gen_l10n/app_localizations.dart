import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_es.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'gen_l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale) : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('es')
  ];

  /// No description provided for @initialBannerTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to my'**
  String get initialBannerTitle;

  /// No description provided for @homeTitle.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get homeTitle;

  /// No description provided for @goHome.
  ///
  /// In en, this message translates to:
  /// **'Go Home'**
  String get goHome;

  /// No description provided for @aboutText.
  ///
  /// In en, this message translates to:
  /// **'I code and\ncreate '**
  String get aboutText;

  /// No description provided for @aboutIt.
  ///
  /// In en, this message translates to:
  /// **'content'**
  String get aboutIt;

  /// No description provided for @aboutMeDescription.
  ///
  /// In en, this message translates to:
  /// **'Hi, I\'m Christopher, a multiplatform developer specializing in Flutter. With over two years of experience, I\'ve created applications that solve real problems and I love integrating technologies like Firebase and AI, including Gemini. I\'ve worked with dynamic startups and I\'m ready to share what I know on TikTok and YouTube. Thanks for joining me on this journey!'**
  String get aboutMeDescription;

  /// No description provided for @getInTouch.
  ///
  /// In en, this message translates to:
  /// **'Get in Touch'**
  String get getInTouch;

  /// No description provided for @downloadResume.
  ///
  /// In en, this message translates to:
  /// **'Download Resume'**
  String get downloadResume;

  /// No description provided for @knowledgeOf.
  ///
  /// In en, this message translates to:
  /// **'Knowledge of'**
  String get knowledgeOf;

  /// No description provided for @projectsTitle.
  ///
  /// In en, this message translates to:
  /// **'Projects'**
  String get projectsTitle;

  /// No description provided for @project.
  ///
  /// In en, this message translates to:
  /// **'Project'**
  String get project;

  /// No description provided for @projectDescription.
  ///
  /// In en, this message translates to:
  /// **'As a developer, I\'ve had the opportunity to work on different projects, both personal and professional. Below are some of the projects I\'ve worked on:'**
  String get projectDescription;

  /// No description provided for @filterBy.
  ///
  /// In en, this message translates to:
  /// **'Filter by'**
  String get filterBy;

  /// No description provided for @allProjects.
  ///
  /// In en, this message translates to:
  /// **'All Projects'**
  String get allProjects;

  /// No description provided for @noProjects.
  ///
  /// In en, this message translates to:
  /// **'No projects found'**
  String get noProjects;

  /// No description provided for @mainImageTitle.
  ///
  /// In en, this message translates to:
  /// **'Main Image'**
  String get mainImageTitle;

  /// No description provided for @companyName.
  ///
  /// In en, this message translates to:
  /// **'Company Name'**
  String get companyName;

  /// No description provided for @shortDescription.
  ///
  /// In en, this message translates to:
  /// **'Short Description'**
  String get shortDescription;

  /// No description provided for @websiteTitle.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get websiteTitle;

  /// No description provided for @sourceCodeTitle.
  ///
  /// In en, this message translates to:
  /// **'Source Code'**
  String get sourceCodeTitle;

  /// No description provided for @screenshotsTitle.
  ///
  /// In en, this message translates to:
  /// **'Screenshots'**
  String get screenshotsTitle;

  /// No description provided for @featuresTitle.
  ///
  /// In en, this message translates to:
  /// **'Features'**
  String get featuresTitle;

  /// No description provided for @seeAllButtonTitle.
  ///
  /// In en, this message translates to:
  /// **'See All'**
  String get seeAllButtonTitle;

  /// No description provided for @technologiesTitle.
  ///
  /// In en, this message translates to:
  /// **'Technologies'**
  String get technologiesTitle;

  /// No description provided for @technology.
  ///
  /// In en, this message translates to:
  /// **'Technology'**
  String get technology;

  /// No description provided for @experienceTitle.
  ///
  /// In en, this message translates to:
  /// **'Experience'**
  String get experienceTitle;

  /// No description provided for @experienceTime.
  ///
  /// In en, this message translates to:
  /// **'Experience Time'**
  String get experienceTime;

  /// No description provided for @contactTitle.
  ///
  /// In en, this message translates to:
  /// **'Contact'**
  String get contactTitle;

  /// No description provided for @contactDescription.
  ///
  /// In en, this message translates to:
  /// **'If you have any questions or would like to work with me, feel free to contact me using the form below. I\'ll get back to you as soon as possible. Thanks!'**
  String get contactDescription;

  /// No description provided for @nameLabel.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get nameLabel;

  /// No description provided for @emailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get emailLabel;

  /// No description provided for @phoneNumberLabel.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get phoneNumberLabel;

  /// No description provided for @messageLabel.
  ///
  /// In en, this message translates to:
  /// **'Message'**
  String get messageLabel;

  /// No description provided for @chooseHowToContact.
  ///
  /// In en, this message translates to:
  /// **'Choose how to contact'**
  String get chooseHowToContact;

  /// No description provided for @searchCountryHint.
  ///
  /// In en, this message translates to:
  /// **'Search country'**
  String get searchCountryHint;

  /// No description provided for @sendThrough.
  ///
  /// In en, this message translates to:
  /// **'Send through'**
  String get sendThrough;

  /// No description provided for @sendMessage.
  ///
  /// In en, this message translates to:
  /// **'Send Message'**
  String get sendMessage;

  /// No description provided for @messageTemplate.
  ///
  /// In en, this message translates to:
  /// **'Hi,\nMy name is *{fieldName}*,\nI came from your website {fieldName2}\n*and I would like to find out more about:*\n\n{fieldName3}\n\nYou can contact me through:\n*Phone Number:* {fieldName4}\n*Email:* {fieldName5}\n\n*Thank you!*'**
  String messageTemplate(Object fieldName, Object fieldName2, Object fieldName3, Object fieldName4, Object fieldName5);

  /// No description provided for @pageNotFound404.
  ///
  /// In en, this message translates to:
  /// **'404 - Page not found!'**
  String get pageNotFound404;

  /// No description provided for @create.
  ///
  /// In en, this message translates to:
  /// **'Create {fieldName}'**
  String create(Object fieldName);

  /// No description provided for @update.
  ///
  /// In en, this message translates to:
  /// **'Update {fieldName}'**
  String update(Object fieldName);

  /// No description provided for @delete.
  ///
  /// In en, this message translates to:
  /// **'Delete {fieldName}'**
  String delete(Object fieldName);

  /// No description provided for @close.
  ///
  /// In en, this message translates to:
  /// **'Close'**
  String get close;

  /// No description provided for @whatsYour.
  ///
  /// In en, this message translates to:
  /// **'What\'s your {fieldName}?'**
  String whatsYour(Object fieldName);

  /// No description provided for @errorMessage.
  ///
  /// In en, this message translates to:
  /// **'Please enter your {fieldName}'**
  String errorMessage(Object fieldName);

  /// No description provided for @error.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get error;

  /// No description provided for @adminPanel.
  ///
  /// In en, this message translates to:
  /// **'Admin Panel'**
  String get adminPanel;

  /// No description provided for @upload.
  ///
  /// In en, this message translates to:
  /// **'Upload'**
  String get upload;

  /// No description provided for @image.
  ///
  /// In en, this message translates to:
  /// **'Image'**
  String get image;

  /// No description provided for @signIn.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get signIn;

  /// No description provided for @signOut.
  ///
  /// In en, this message translates to:
  /// **'Sign Out'**
  String get signOut;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @areYouSure.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to {fieldName} ?'**
  String areYouSure(Object fieldName);

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>['en', 'es'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {


  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en': return AppLocalizationsEn();
    case 'es': return AppLocalizationsEs();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.'
  );
}
