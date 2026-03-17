import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AdminDialog extends StatelessWidget {
  const AdminDialog({
    required this.asCreating,
    required this.title,
    required this.formKey,
    required this.contentWidgets,
    required this.createButton,
    required this.updateButton,
    required this.deleteButton,
    super.key,
  });

  final bool asCreating;
  final String title;
  final GlobalKey<FormState> formKey;
  final List<Widget> contentWidgets;
  final Widget createButton;
  final Widget updateButton;
  final Widget deleteButton;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Text(asCreating ? l10n.create(title) : l10n.update(title)),
      scrollable: true,
      actionsAlignment: MainAxisAlignment.center,
      actionsOverflowButtonSpacing: 15,
      content: ResponsiveCenter(
        child: Form(
          key: formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ...contentWidgets,
            ],
          ),
        ),
      ),
      actions: [
        if (!asCreating) ...[
          updateButton,
          deleteButton,
        ],
        if (asCreating) createButton,
      ],
    );
  }
}
