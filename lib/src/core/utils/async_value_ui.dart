import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/alert_dialogs.dart';
import 'package:portfolio/src/localization/l10n.dart';

extension AsyncValueUI on AsyncValue<dynamic> {
  void showAlertDialogOnError(BuildContext context) {
    final l10n = context.l10n;
    if (!isLoading && hasError) {
      showExceptionAlertDialog(
        context: context,
        title: l10n.error,
        exception: error,
      );
    }
  }
}
