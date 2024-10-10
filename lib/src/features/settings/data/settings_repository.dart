import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'settings_repository.g.dart';

class SettingsRepository {
  /// Loads the User's preferred ThemeMode from local or remote storage.
  Future<ThemeMode> getThemeMode() async => ThemeMode.dark;

  /// Loads the User's preferred Locale from local or remote storage.
  Future<Locale> getLocale() async => const Locale('en');

  /// Persists the user's preferred ThemeMode to local or remote storage.
  Future<void> setThemeMode(ThemeMode themeMode) async {
    // Use the shared_preferences package to persist settings locally or the
    // http package to persist settings over the network.
  }

  /// Persists the user's preferred ThemeMode to local or remote storage.
  Future<void> setLocale(Locale locale) async {
    // Use the shared_preferences package to persist settings locally or the
    // http package to persist settings over the network.
  }
}

@riverpod
SettingsRepository settingsRepository(SettingsRepositoryRef ref) {
  return SettingsRepository();
}
