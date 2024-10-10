import 'package:flutter/material.dart';
import 'package:portfolio/src/features/settings/data/settings_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'theme_controller.g.dart';

@riverpod
class ThemeController extends _$ThemeController {
  @override
  Future<ThemeMode> build() async {
    return ref.read(settingsRepositoryProvider).getThemeMode();
  }

  Future<void> changeTheme() async {
    final settingProvider = ref.read(settingsRepositoryProvider);
    state.whenData((themeMode) async {
      final newThemeMode =
          themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
      state = const AsyncLoading();
      state = await AsyncValue.guard(() async {
        await settingProvider.setThemeMode(newThemeMode);
        return newThemeMode;
      });
    });
  }
}
