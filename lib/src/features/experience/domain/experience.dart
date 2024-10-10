class Experience {
  const Experience({
    required this.date,
    required this.companyName,
    required this.jobNameEn,
    required this.jobNameEs,
    required this.responsabilitiesEn,
    required this.responsabilitiesEs,
  });

  final String date;
  final String companyName;
  final String jobNameEn;
  final String jobNameEs;
  final List<String> responsabilitiesEn;
  final List<String> responsabilitiesEs;
}

extension ExperienceX on Experience {
  String jobName(String languageCode) {
    return languageCode == 'en' ? jobNameEn : jobNameEs;
  }

  List<String> responsabilities(String languageCode) {
    return languageCode == 'en' ? responsabilitiesEn : responsabilitiesEs;
  }
}
