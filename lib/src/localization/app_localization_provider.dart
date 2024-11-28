import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'app_localization_provider.g.dart';

@riverpod
AppLocalizations appLocalizations(Ref ref) {
  final locale = ref.watch(localeControllerProvider).value;

  return lookupAppLocalizations(locale ?? const Locale('en'));
}
