import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/common_widgets/secondary_button.dart';
import 'package:portfolio/src/features/auth/presentation/auth_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_route.dart';
import 'package:portfolio/src/routing/app_router.dart';

class SignOutAlert extends StatelessWidget {
  const SignOutAlert({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Text(l10n.areYouSure(l10n.signOut)),
      scrollable: true,
      actionsAlignment: MainAxisAlignment.center,
      actionsOverflowButtonSpacing: 15,
      actions: [
        SecondaryButton(
          title: l10n.cancel,
          onTap: () => Navigator.of(context).pop(),
        ),
        Consumer(
          builder: (context, ref, _) {
            final authController = ref.read(authControllerProvider.notifier);
            return PrimaryButton(
              title: l10n.signOut,
              onTap: () async {
                await authController.signOut();
                rootNavigatorKey.currentState
                    ?.popUntil((route) => route.isFirst);
                if (!context.mounted) return;
                context.go(AppRoute.home.path);
              },
            );
          },
        ),
      ],
    );
  }
}
