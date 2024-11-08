extension StringX on String {
  bool get isValidUrl {
    const urlPattern = r'^(http|https):\/\/';
    final urlRegex = RegExp(urlPattern);
    return urlRegex.hasMatch(this);
  }
}
