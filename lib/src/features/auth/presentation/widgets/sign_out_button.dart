import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/features/auth/presentation/sign_out_alert.dart';
import 'package:portfolio/src/localization/l10n.dart';

class SignOutButton extends StatelessWidget {
  const SignOutButton({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return PrimaryButton(
      title: l10n.signOut,
      onTap: () {
        showDialog<void>(
          context: context,
          builder: (context) => const SignOutAlert(),
        );
      },
    );
  }
}
