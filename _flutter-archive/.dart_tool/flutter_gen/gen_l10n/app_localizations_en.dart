import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get initialBannerTitle => 'Welcome to my';

  @override
  String get homeTitle => 'Home';

  @override
  String get goHome => 'Go Home';

  @override
  String get aboutText => 'I code and\ncreate ';

  @override
  String get aboutIt => 'content';

  @override
  String get aboutMeDescription => 'Hi, I\'m Christopher, a multiplatform developer specializing in Flutter. With over two years of experience, I\'ve created applications that solve real problems and I love integrating technologies like Firebase and AI, including Gemini. I\'ve worked with dynamic startups and I\'m ready to share what I know on TikTok and YouTube. Thanks for joining me on this journey!';

  @override
  String get getInTouch => 'Get in Touch';

  @override
  String get downloadResume => 'Download Resume';

  @override
  String get knowledgeOf => 'Knowledge of';

  @override
  String get projectsTitle => 'Projects';

  @override
  String get project => 'Project';

  @override
  String get projectDescription => 'As a developer, I\'ve had the opportunity to work on different projects, both personal and professional. Below are some of the projects I\'ve worked on:';

  @override
  String get filterBy => 'Filter by';

  @override
  String get allProjects => 'All Projects';

  @override
  String get noProjects => 'No projects found';

  @override
  String get mainImageTitle => 'Main Image';

  @override
  String get companyName => 'Company Name';

  @override
  String get shortDescription => 'Short Description';

  @override
  String get websiteTitle => 'Website';

  @override
  String get sourceCodeTitle => 'Source Code';

  @override
  String get screenshotsTitle => 'Screenshots';

  @override
  String get featuresTitle => 'Features';

  @override
  String get seeAllButtonTitle => 'See All';

  @override
  String get technologiesTitle => 'Technologies';

  @override
  String get technology => 'Technology';

  @override
  String get experienceTitle => 'Experience';

  @override
  String get experienceTime => 'Experience Time';

  @override
  String get contactTitle => 'Contact';

  @override
  String get contactDescription => 'If you have any questions or would like to work with me, feel free to contact me using the form below. I\'ll get back to you as soon as possible. Thanks!';

  @override
  String get nameLabel => 'Name';

  @override
  String get emailLabel => 'Email';

  @override
  String get phoneNumberLabel => 'Phone Number';

  @override
  String get messageLabel => 'Message';

  @override
  String get chooseHowToContact => 'Choose how to contact';

  @override
  String get searchCountryHint => 'Search country';

  @override
  String get sendThrough => 'Send through';

  @override
  String get sendMessage => 'Send Message';

  @override
  String messageTemplate(Object fieldName, Object fieldName2, Object fieldName3, Object fieldName4, Object fieldName5) {
    return 'Hi,\nMy name is *$fieldName*,\nI came from your website $fieldName2\n*and I would like to find out more about:*\n\n$fieldName3\n\nYou can contact me through:\n*Phone Number:* $fieldName4\n*Email:* $fieldName5\n\n*Thank you!*';
  }

  @override
  String get pageNotFound404 => '404 - Page not found!';

  @override
  String create(Object fieldName) {
    return 'Create $fieldName';
  }

  @override
  String update(Object fieldName) {
    return 'Update $fieldName';
  }

  @override
  String delete(Object fieldName) {
    return 'Delete $fieldName';
  }

  @override
  String get close => 'Close';

  @override
  String whatsYour(Object fieldName) {
    return 'What\'s your $fieldName?';
  }

  @override
  String errorMessage(Object fieldName) {
    return 'Please enter your $fieldName';
  }

  @override
  String get error => 'Error';

  @override
  String get adminPanel => 'Admin Panel';

  @override
  String get upload => 'Upload';

  @override
  String get image => 'Image';

  @override
  String get signIn => 'Sign In';

  @override
  String get signOut => 'Sign Out';

  @override
  String get password => 'Password';

  @override
  String areYouSure(Object fieldName) {
    return 'Are you sure you want to $fieldName ?';
  }

  @override
  String get cancel => 'Cancel';
}
